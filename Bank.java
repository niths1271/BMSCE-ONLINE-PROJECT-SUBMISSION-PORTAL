import java.util.Scanner;

import javax.lang.model.util.ElementScanner14;
 abstract class Account
{
    Scanner s=new Scanner(System.in);
    String name;
    long num;
    String type;
  double bal;
    Account(){}

Account(String name,long num,String type,double bal)
{
    this.name=name;
    this.num=num;
    this.type=type;
    this.bal=bal;
}
String acc()
{
    return type;
}
double min=2000.00;
abstract void deposit();
abstract void withdrawal();
abstract void display();
}
class Curact extends Account
{
    void withdrawal()
{
    System.out.println("ENTER THE AMOUNT TO BE WITHDRAWED");
    int amt=s.nextInt();
    if(bal==0 || bal<min || amt>(bal-2000))
    {
        System.out.println("WITHDRAWAL NOT POSSIBLE");
    }
    else
    {
        bal=bal-amt;
        System.out.println("AMOUNT OF"+amt+"IS WITHDRAWED FROM THE ACCOUNT");
        System.out.println("REMAINING BALANCE IS="+bal);
    }
}
    void deposit()
    {
        System.out.println("ENTER THE AMOUNT TO BE DEPOSITED");
        int amt1=s.nextInt();
        bal=bal+amt1;
        System.out.println("THE REMAINING BALANCE OF THE ACOOUNT= "+bal);
    }
    void display()
    {
        if (bal<min)
        {
            System.out.println("AMOUNT OF 145/- IS DEDUCTED FROM UR ACCOUNT DUE TO LESS BALANCE");
            bal=bal-145;
            System.out.println("BALANCE="+bal);
        }
        else
            System.out.println("BALANCE="+bal);
    }
}
class Savact extends Account
{
    void withdrawal()
    {
    System.out.println("ENTER THE AMOUNT TO BE WITHDRAWED");
    int amt=s.nextInt();
    if(bal==0 || amt>bal)
    {
        System.out.println("WITHDRAWAL NOT POSSIBLE");
    }
    else
    {
        bal=bal-amt;
        System.out.println("AMOUNT OF"+amt+"IS WITHDRAWED FROM THE ACCOUNT");
        System.out.println("REMAINING BALANCE IS="+bal);
    }
}
    void deposit()
    {
        System.out.println("ENTER THE AMOUNT TO BE DEPOSITED");
        int amt1=s.nextInt();
        System.out.println("THE RATE OF INTEREST IS 5%");
        double ci=amt1*(1+0.05);
        bal=bal+ci;
        System.out.println("THE REMAINING BALANCE OF THE ACCOUNT= "+bal);
    }
    void display()
    {
            System.out.println("BALANCE="+bal);
    }
}
 
class bankmain
{
    Scanner s=new Scanner(System.in);
    Curact c=new Curact("nithin",123456,"current",2000);
    Savact sa=new Savact("nithin",12456,"savings",2000);
    if((c.acc().equalsIgnorecase(current))==0)
    {
        while( i != 0) 
        {
            System.out.println("1:DEPOSIT \n2:DISPLAY BALANCE\n 3:WITHDRAWAL");
            System.out.println("ENTER THE CHOICE");
            int ch = s.nextInt();
            switch (ch) {
                case 1:
                    c.deposit();
                    break;

                case 2:
                    c.display();
                    break;

                case 3:
                    c.withdrawal();
                    break;
                    case 4:
                     exit(0);
                default:
                    System.out.println("INVALID CHOICE");
            }
        }
    }

    else
    System.out.println("INVALID");

        if((sa.acc().equalsIgnorecase(savings))==0)
    {
        while( i != 0) 
        {
            System.out.println("1:DEPOSIT \n2:DISPLAY BALANCE\n 3:WITHDRAWAL");
            System.out.println("ENTER THE CHOICE");
            int ch1 = s.nextInt();
            switch (ch1) {
                case 1:
                    c.deposit();
                    break;

                case 2:
                    c.display();
                    break;

                case 3:
                    c.withdrawal();
                    break;
                    case 4:
                     exit(0);
                default:
                    System.out.println("INVALID CHOICE");
            }
        }
    }

    else
    System.out.println("INVALID");

}
}

 
    










